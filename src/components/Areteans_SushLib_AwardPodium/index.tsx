import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  EmptyState,
  Flex,
  Text,
  useTheme,
  VisuallyHiddenText,
  withConfiguration
} from '@pega/cosmos-react-core';
import type { PConnFieldProps } from '../shared/PConnProps';
import '../shared/create-nonce';

import StyledAreteansSushLibAwardPodiumWrapper, { StyledPodium, StyledPodiumPlace, StyledStep } from './styles';

interface AreteansSushLibAwardPodiumProps extends PConnFieldProps {
  employeeOfMonth?: string;
  starOfWeek?: string;
  inspirationOfDay?: string;
}

interface Place {
  rank: 1 | 2 | 3;
  award: string;
  name: string;
}

const isTrue = (flag: unknown) => flag === true || flag === 'true';

export const toPlaces = (
  employeeOfMonth?: string | null,
  starOfWeek?: string | null,
  inspirationOfDay?: string | null
): Place[] => [
  { rank: 1, award: 'Employee of the Month', name: (employeeOfMonth ?? '').trim() },
  { rank: 2, award: 'Star of the Week', name: (starOfWeek ?? '').trim() },
  { rank: 3, award: 'Inspiration of the Day', name: (inspirationOfDay ?? '').trim() }
];

function AreteansSushLibAwardPodium(props: AreteansSushLibAwardPodiumProps) {
  const { getPConnect, label = 'Our Stars', employeeOfMonth, starOfWeek, inspirationOfDay } = props;
  const hideLabel = isTrue(props.hideLabel);

  const localization = getPConnect().getLocalizationService();
  const t = (text: string) => localization.getLocalizedText(text);
  const palette = useTheme().base.palette;

  const places = toPlaces(employeeOfMonth, starOfWeek, inspirationOfDay);
  const hasAnyName = places.some(place => place.name !== '');
  const heading = label || t('Award podium');

  return (
    <StyledAreteansSushLibAwardPodiumWrapper>
      <Card>
        {!hideLabel && (
          <CardHeader>
            <Text variant='h2'>{heading}</Text>
          </CardHeader>
        )}
        <CardContent>
          {hasAnyName ? (
            <StyledPodium aria-label={heading}>
              {places.map(place => (
                <StyledPodiumPlace key={place.rank} $rank={place.rank}>
                  <Flex container={{ direction: 'column', alignItems: 'center', gap: 0.5 }}>
                    {place.name !== '' && <Avatar name={place.name} size='l' />}
                    <Text variant='h3'>{place.name !== '' ? place.name : t('To be announced')}</Text>
                    <Text variant='secondary'>{t(place.award)}</Text>
                  </Flex>
                  <StyledStep
                    $rank={place.rank}
                    $accent={palette['brand-primary']}
                    $background={palette['secondary-background']}
                  >
                    <Text variant='h2'>
                      <VisuallyHiddenText>{`${t('Rank')} `}</VisuallyHiddenText>
                      {place.rank}
                    </Text>
                  </StyledStep>
                </StyledPodiumPlace>
              ))}
            </StyledPodium>
          ) : (
            <EmptyState message={t('No awards have been announced yet.')} />
          )}
        </CardContent>
      </Card>
    </StyledAreteansSushLibAwardPodiumWrapper>
  );
}

export default withConfiguration(AreteansSushLibAwardPodium);
