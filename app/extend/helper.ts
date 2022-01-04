import {  Context } from 'egg'

interface RespType {
    ctx: Context
    res?: any
    msg?: string
}

export default {
    success({ ctx, res, msg }: RespType) {
        ctx.body = {
            code: 0,
            msg: msg || '请求成功',
            data: res
        }
        ctx.ststus = 200
    }
}