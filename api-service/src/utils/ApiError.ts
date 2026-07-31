export class ApiError extends Error{
    statusCode:number
    errors:[]

    constructor(
        statusCode:number,
        message:string = "Something went wrong",
        errors?:[],
        stack?:string
    ){
        super(stack),
        this.statusCode = statusCode,
        this.message = message,
        this.stack = stack as string,
        this.errors = errors as []
    }
}