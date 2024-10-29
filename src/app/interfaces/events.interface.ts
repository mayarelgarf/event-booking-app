export interface IEventsForm {
  name: string;
  email: string;
  acceptTerms: boolean;

}

export interface IMonth {
  id:number
  name: string;
}
export interface IEventFormReq{
  monthId:number,
  name:string,
  email:string,
  isNotificationAllowed:boolean
}
