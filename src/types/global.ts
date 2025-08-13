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
  page?: number;
  limit?: number;
  invoiceId?: string;
  name: string;
  value: string | number | boolean; 
};

export type TResponseRedux<T> = TResponse<T> & BaseQueryApi;


export interface ApiResponse<T> {
  data: {
    data: T[];
    meta?: TMeta;
  };
}
