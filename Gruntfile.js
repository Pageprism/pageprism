module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: {
      assets: 'assets/',
      css: '<%= pkg.assets %>/css/',
      sass: '<%= pkg.assets %>/sass/',
      js: '<%= pkg.assets %>/js/',
      handlebars: '<%= pkg.assets %>/handlebars/'
    },
    sass: {
      options: {
        sourceMap: true,
        outputStyle: 'expanded',
      },
      dist: {
        files: {
          '<%= pkg.css %>/esamizdat.css': '<%= pkg.sass%>importAll.sass'
        }
      }
    },
    handlebars: {
      options: {
        namespace: 'Pageshare.Templates'
      },
      all: {
        files: {
          "<%= pkg.js %>templates.js": ["<%= pkg.handlebars %>/*.handlebars"]
        }
      }
    },
    fastWatch: {
      all: {
        dir: '<%= pkg.assets %>',
        trigger: {
          server: {
            care: ["*.js","*.sass", "*.handlebars"],
            tasks: ['default']
          }
        }
      },
    }
  });

  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-fast-watch');
  grunt.loadNpmTasks('grunt-contrib-handlebars');

  // Default task(s).
  grunt.registerTask('default', ['sass', 'handlebars']);
  grunt.registerTask('watch', ['fastWatch:all']);
};
