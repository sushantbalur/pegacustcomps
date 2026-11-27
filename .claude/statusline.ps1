$raw = [Console]::In.ReadToEnd()
$j = $raw | ConvertFrom-Json
$esc = [char]27
$model = $j.model.display_name
$pct = $j.context_window.used_percentage
if ($null -eq $pct) { $pct = 0 }
$pct = [math]::Round([double]$pct)
$width = 10
$filled = [math]::Min($width, [math]::Max(0, [math]::Floor($pct * $width / 100)))
$bar = ('#' * $filled) + ('-' * ($width - $filled))
if ($pct -ge 80) { $c = '31' } elseif ($pct -ge 50) { $c = '33' } else { $c = '32' }
$dir = $j.workspace.current_dir
if (-not $dir) { $dir = $j.cwd }
$branch = ''
if ($dir) {
  $branch = (& git --no-optional-locks -C $dir branch --show-current 2>$null | Out-String).Trim()
  if (-not $branch) {
    $branch = (& git --no-optional-locks -C $dir rev-parse --short HEAD 2>$null | Out-String).Trim()
  }
}
$branchSeg = ''
if ($branch) { $branchSeg = " | $esc[35m$branch$esc[0m" }

# Session elapsed time (HH:mm), anchored to a start stamp saved per session id
$timeSeg = ''
$sid = $j.session_id
if ($sid) {
  $stampFile = Join-Path $env:TEMP "claude-statusline-$sid.start"
  $now = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
  $start = $null
  if (Test-Path $stampFile) {
    $parsed = 0L
    if ([long]::TryParse((Get-Content $stampFile -Raw).Trim(), [ref]$parsed)) { $start = $parsed }
  }
  if ($null -eq $start) {
    $start = $now
    Set-Content -Path $stampFile -Value $start -Encoding ASCII
  }
  $secs = [math]::Max(0, $now - $start)
  $elapsed = '{0:00}:{1:00}' -f [math]::Floor($secs / 3600), [math]::Floor(($secs % 3600) / 60)
  $timeSeg = " | $esc[34m$elapsed$esc[0m"
}

# Token usage
function Format-Tok($n) {
  $n = [double]$n
  if ($n -ge 1000000) { return ('{0:0.0}M' -f ($n / 1000000)) }
  if ($n -ge 1000) { return ('{0:0.0}k' -f ($n / 1000)) }
  return ('{0:0}' -f $n)
}
$tokIn = $j.context_window.total_input_tokens
$tokOut = $j.context_window.total_output_tokens
if ($null -eq $tokIn) { $tokIn = 0 }
if ($null -eq $tokOut) { $tokOut = 0 }
$tokSeg = " | tok in $(Format-Tok $tokIn) out $(Format-Tok $tokOut)"

[Console]::Out.Write("$esc[36m$model$esc[0m$branchSeg$timeSeg | ctx $esc[${c}m[$bar] $pct%$esc[0m$tokSeg")
