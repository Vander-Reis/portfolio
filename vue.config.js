module.exports = {
 
    css: {
      loaderOptions: {
        sass: {
          additionalData: '@import "@/assets/styles/file.scss";',
          implementation: require('node-sass')
        },
      },
    },
  
  };