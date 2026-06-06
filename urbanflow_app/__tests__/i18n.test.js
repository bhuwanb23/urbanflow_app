/**
 * 4.4 — App-wide i18n tests
 * Verifies the new utils/i18n module loads, exposes the
 * t/changeLanguage/getCurrentLanguage helpers, supports the
 * common/errors/nav namespaces in both English and Spanish,
 * and flips output on language change.
 */

import { t, changeLanguage, getCurrentLanguage, availableLanguages, defaultLanguage } from '../utils/i18n';

describe('4.4 — i18n', () => {
  beforeEach(async () => {
    await changeLanguage(defaultLanguage);
  });

  test('exports the availableLanguages list with English and Spanish', () => {
    expect(availableLanguages).toEqual(expect.arrayContaining(['en', 'es']));
    expect(defaultLanguage).toBe('en');
  });

  test('t() returns English strings by default', () => {
    expect(t('common.loading')).toBe('Loading...');
    expect(t('common.retry')).toBe('Try Again');
    expect(t('nav.planner')).toBe('Planner');
    expect(t('errors.generic')).toBe('Oops! Something went wrong');
  });

  test('changeLanguage("es") flips the output to Spanish', async () => {
    await changeLanguage('es');
    expect(getCurrentLanguage()).toBe('es');
    expect(t('common.loading')).toBe('Cargando...');
    expect(t('common.retry')).toBe('Intentar de nuevo');
    expect(t('nav.planner')).toBe('Planificador');
    expect(t('errors.generic')).toBe('¡Ups! Algo salió mal');
  });

  test('interpolation works for parameterized strings', async () => {
    await changeLanguage('en');
    expect(t('journey.duration', { duration: '42 min', arrivalTime: '09:15 AM' }))
      .toBe('42 min • Arriving 09:15 AM');
  });
});
