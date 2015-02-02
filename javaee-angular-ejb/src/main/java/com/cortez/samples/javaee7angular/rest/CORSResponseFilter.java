package com.cortez.samples.javaee7angular.rest;

import java.io.IOException;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.container.PreMatching;
import javax.ws.rs.ext.Provider;

@Provider
//must remove the following line to make it work
//it is applied to a container request filter, not response filter
//@PreMatching
public class CORSResponseFilter implements ContainerResponseFilter {
	@Override
	public void filter(ContainerRequestContext requestc,
			ContainerResponseContext responsec) throws IOException {
        System.out.println( "Executing REST response filter" );
        //more to do to make it work for IE
        //refer to http://www.webdavsystem.com/ajax/programming/cross_origin_requests
        /*
        if (responsec.getHeaders().get("Origin").toString().equals("http://localhost:8080")) {
        	responsec.getHeaders().add("Access-Control-Allow-Origin", "http://localhost:8080");
        }
        if (responsec.getHeaders().get("Origin").toString().equals("https://localhost:8443")) {
        	responsec.getHeaders().add("Access-Control-Allow-Origin", "https://localhost:8443");
        }
        */
        responsec.getHeaders().add("Access-Control-Allow-Origin", "http://localhost:8080");
		//responsec.getHeaders().add("Access-Control-Allow-Credentials", "true");
		responsec.getHeaders().add("Access-Control-Allow-Methods", "OPTIONS, GET, POST, DELETE, PUT, HEAD");
		//responsec.getHeaders().add("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-With");		
		responsec.getHeaders().add("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-With, Accept-Encoding, Accept-Language, Cache-Control, Connection, Host, Origin, Referer, User-Agent");	
        System.out.println(responsec.getHeaders().keySet().toString());

	}
}
