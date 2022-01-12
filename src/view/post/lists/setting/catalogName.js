export const catalogName = (catalog) => {
  let result
  switch (catalog) {
    case 'ask':
      result = '提问'
      break
    case 'advise':
      result = '建议'
      break
    case 'discuss':
      result = '交流'
      break
    case 'share':
      result = '分享'
      break
    case 'logs':
      result = '动态'
      break
    case 'notice':
      result = '公告'
      break
    default:
      result = '全部'
  }
  return result
}
