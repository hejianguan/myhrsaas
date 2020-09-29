// 负责权限管理的接口
import request from '@/utils/request'
// 获取员工权限
export function getPermissionList(params) {
  return request({
    url: '/sys/permission',
    params
  })
}
// 获取员工权限
export function addPermission(data) {
  return request({
    url: '/sys/permission',
    method: 'post',
    data
  })
}

// 获取员工权限
export function updatePermission(data) {
  return request({
    url: `/sys/permission/${data.id}`,
    method: 'put',
    data
  })
}

// 获取员工权限
export function delPermission(id) {
  return request({
    url: `/sys/permission/${id}`,
    method: 'delete'
  })
}
// 获取员工权限
export function getPermissionDetail(id) {
  return request({
    url: `/sys/permission/${id}`
  })
}

