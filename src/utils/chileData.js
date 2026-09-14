export const BANCOS_CHILE = [
  { id: 'banco_estado', name: 'BancoEstado', logo: '🦆' },
  { id: 'banco_chile', name: 'Banco de Chile', logo: '🔵' },
  { id: 'banco_santander', name: 'Banco Santander', logo: '🔴' },
  { id: 'banco_bci', name: 'Banco BCI', logo: '🟢' },
  { id: 'banco_itau', name: 'Banco Itaú', logo: '🟠' },
  { id: 'banco_scotiabank', name: 'Scotiabank', logo: '🍁' },
  { id: 'banco_falabella', name: 'Banco Falabella', logo: '💚' },
  { id: 'banco_ripley', name: 'Banco Ripley', logo: '🟣' },
  { id: 'banco_security', name: 'Banco Security', logo: '🛡️' },
  { id: 'banco_consorcio', name: 'Banco Consorcio', logo: '🏢' },
  { id: 'banco_bice', name: 'Banco BICE', logo: '🏛️' },
  { id: 'banco_internacional', name: 'Banco Internacional', logo: '🌐' },
  { id: 'tenpo', name: 'Tenpo', logo: '📱' },
  { id: 'mach', name: 'MACH', logo: '⚡' },
  { id: 'mercado_pago', name: 'Mercado Pago', logo: '🤝' }
];

export const INSTITUCIONES_INVERSION_CHILE = [
  'Fintual',
  'Racional',
  'SoyFocus',
  'Trii',
  'BancoEstado (Fondos Mutuos)',
  'Banco de Chile (Banchile Inversiones)',
  'Santander Asset Management',
  'BCI Asset Management',
  'LarrainVial',
  'BTG Pactual',
  'AFP Habitat (Cuenta 2 / APV)',
  'AFP Provida (Cuenta 2 / APV)',
  'AFP Capital (Cuenta 2 / APV)',
  'AFP Cuprum (Cuenta 2 / APV)',
  'AFP Modelo (Cuenta 2 / APV)',
  'AFP PlanVital (Cuenta 2 / APV)',
  'AFP Uno (Cuenta 2 / APV)',
  'Otra'
];

export const TARJETAS_CREDITO_CHILE = [
  'CMR Falabella',
  'Tarjeta Ripley',
  'Cencosud Scotiabank',
  'Lider BCI',
  'Visa BancoEstado',
  'Mastercard BancoEstado',
  'Visa Banco de Chile',
  'Mastercard Banco de Chile',
  'Visa Santander',
  'Mastercard Santander',
  'Visa BCI',
  'Mastercard BCI',
  'Visa Itaú',
  'Mastercard Itaú',
  'Visa Scotiabank',
  'Mastercard Scotiabank',
  'Otra'
];

export const TIPOS_INVERSION = [
  'Depósito a Plazo (DAP)',
  'Fondo Mutuo (Renta Fija)',
  'Fondo Mutuo (Renta Variable)',
  'Acciones Nacionales (IPSA)',
  'Acciones Internacionales / ETFs',
  'Criptomonedas',
  'Bienes Raíces / Mutuos Hipotecarios',
  'APV (Ahorro Previsional Voluntario)',
  'Cuenta 2 (AFP)',
  'Otro'
];

// Utilidad para formatear montos con separador de miles
export const formatMiles = (value) => {
  if (!value) return '';
  const onlyNums = value.toString().replace(/\D/g, '');
  return onlyNums.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const parseMiles = (value) => {
  if (!value) return 0;
  return parseInt(value.toString().replace(/\./g, ''), 10) || 0;
};
