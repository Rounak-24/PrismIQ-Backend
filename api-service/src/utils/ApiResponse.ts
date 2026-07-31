export class ApiResponse{
    statusCode:number
    message:string
    data:any
    success:boolean

    constructor(
        statusCode:number,
        data?:any,
        message?:string,
    ){
        this.statusCode = statusCode || 200
        this.data = data
        this.message = message || "Success"
        this.success = (statusCode<400)
    }
}