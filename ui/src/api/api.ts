// export const orderAPI = {
//   index: (data: { page: number }) => {
//     return makeRequest<any, 'list'>({
//       method: 'post',
//       url: '/api/order',
//       data,
//     })
//   },
// }

export const uploadService = (formData: FormData) => {
  return makeRequest({
    method: 'post',
    url: '/api/upload',
    data: formData,
    headers: {
      'Content-type': 'multipart/form-data',
    },
  })
}
/**
 * 基本请求参数
 */
export interface BaseRequestParam {
  page: number
  nav: string
  sort?: string
  search?: string
}
