const swaggerJsdoc = require("swagger-jsdoc")

const options = {
    definition: {
        openapi: "3.0.0",
        info:{
            title: "API Vortex Gaming",
            version: "1.0.0",
            description: "PC bang: alquiler de PCs y salas, tienda y soporte con tickets"
        },
        components:{
            securitySchemes:{
                bearerAuth:{
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },
    apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;