import request from '@/utils/request.js';

// 获取自己的站内消息、系统消息
// type 0站内消息 1系统消息 2管理员消息
export function getMessages(type, params) {
  return request({
    url: `/message/type/${type}`,
    method: 'get',
    params
  });
}

// 发送站内消息
export function sendMessage(data) {
  return request({
    url: '/message',
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    data
  });
}

// 获取消息详情并修改消息状态
export function getMessageDetail(messageId) {
  return request({
    url: `/message/${messageId}`,
    method: 'get'
  });
}