package com.fullstack.ecommerce.config;


import com.fullstack.ecommerce.entity.Product;
import com.fullstack.ecommerce.entity.ProductCategory;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class DataRestConfig implements RepositoryRestConfigurer {
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] unsupportedAction = {HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE};

        //Disable unsupported action
        config.getExposureConfiguration()
                .forDomainType(Product.class)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedAction))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedAction));

        config.getExposureConfiguration()
                .forDomainType(ProductCategory.class)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedAction))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedAction));
    }
}
