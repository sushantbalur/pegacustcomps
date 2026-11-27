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
[Console]::Out.Write("$esc[36m$model$esc[0m$branchSeg | ctx $esc[${c}m[$bar] $pct%$esc[0m")
