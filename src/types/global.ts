import { BaseQueryApi } from "@reduxjs/toolkit/query";

type TError = {
    data:{
        message:string;
        stack:string;
        success:boolean
    };
    status:number;

}


export type TResponse<T> ={
    data?:T;
    error?:TError;
    meta?:TMeta;
    success:boolean;
    totalPage:number;
}

export type TMeta = {
  total: number;
  totalPages: number; // match backend
  limit: number;
  page: number;
};

export type TQueryParam = {
  name: string;
  value: string | number | boolean; // Accept multiple types
};

export type TResponseRedux<T> = TResponse<T> & BaseQueryApi;