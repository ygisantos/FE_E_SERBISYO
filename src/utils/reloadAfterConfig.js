import configService from './configService';

export async function reloadAfterConfig() {
  if (typeof window !== 'undefined' && !localStorage.getItem('hasReloadedOnce')) {
    await configService.getConfigurations();
    localStorage.setItem('hasReloadedOnce', 'true');
    window.location.reload();
  }
}
