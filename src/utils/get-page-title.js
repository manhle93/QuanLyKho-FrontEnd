import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Hệ thống cảnh báo cháy-SFUL'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
