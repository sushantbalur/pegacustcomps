export const configProps = {
  label: 'Our Stars',
  hideLabel: false,
  employeeOfMonth: 'Priya Raman',
  starOfWeek: 'Marcus Okafor',
  inspirationOfDay: 'Elena Fischer'
};

export const longNameProps = {
  ...configProps,
  employeeOfMonth: 'Maximiliana Alexandrina Featherstonehaugh-Montgomery'
};

export const partialProps = {
  ...configProps,
  starOfWeek: ''
};

export const emptyProps = {
  ...configProps,
  employeeOfMonth: '',
  starOfWeek: '',
  inspirationOfDay: ''
};

export const getPConnect = () => ({
  getLocalizationService: () => ({
    getLocalizedText: (text: string) => text
  })
});
