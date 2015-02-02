package com.cortez.samples.javaee7angular.rest;

import java.io.IOException;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.PreMatching;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;

@Provider
@PreMatching
public class CORSRequestFilter implements ContainerRequestFilter {


    @Override
    public void filter( ContainerRequestContext requestCtx ) throws IOException {
        System.out.println( "Executing REST request filter" );
        System.out.println(requestCtx.getUriInfo().getAbsolutePath().toString() + "-------------absolute path");
        System.out.println("request header is: " + requestCtx.getHeaders().keySet().toString());
        System.out.println("request origin is " + requestCtx.getHeaders().get("Origin"));
        System.out.println("request method is: " + requestCtx.getRequest().getMethod());
        //requestCtx.getHeaders().add("withCredentials", "false");
        // When HttpMethod comes as OPTIONS, just acknowledge that it accepts...
        if ( requestCtx.getRequest().getMethod().equals("OPTIONS") ) {
        	System.out.println( "HTTP Method (OPTIONS) - Detected!" );

            // Just send a OK signal back to the browser
            requestCtx.abortWith( Response.status( Response.Status.OK ).build() );
        }
    }
}

