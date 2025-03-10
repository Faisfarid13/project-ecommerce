package com.fullstack.ecommerce.config;


import com.fullstack.ecommerce.entity.Country;
import com.fullstack.ecommerce.entity.Product;
import com.fullstack.ecommerce.entity.ProductCategory;
import com.fullstack.ecommerce.entity.State;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.core.mapping.ExposureConfigurer;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class DataRestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    @Autowired
    public DataRestConfig(EntityManager entityManager){
        this.entityManager = entityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] unsupportedAction = {HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE};

        //Disable unsupported action
        disableHttpMethods(config.getExposureConfiguration()
                .forDomainType(Product.class), unsupportedAction);

        disableHttpMethods(config.getExposureConfiguration()
                .forDomainType(ProductCategory.class), unsupportedAction);

        disableHttpMethods(config.getExposureConfiguration()
                .forDomainType(Country.class), unsupportedAction);

        disableHttpMethods(config.getExposureConfiguration()
                .forDomainType(State.class), unsupportedAction);

        //call an internal helper
        exposeIds(config);
    }

    private static void disableHttpMethods(ExposureConfigurer config, HttpMethod[] unsupportedAction) {
        config
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedAction))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedAction));
    }

    private void exposeIds(RepositoryRestConfiguration config) {
        //expose entity ids

        //get a list of all entity
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        //create array of the entity
        List<Class> entityClasses = new ArrayList<>();

        //get the entity types
        for(EntityType tempEntityType : entities){
            entityClasses.add(tempEntityType.getJavaType());
        }

        //expose the id
        Class[] domainTypes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
}
