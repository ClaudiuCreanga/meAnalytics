module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
	  options: {
	    separator: ';'
	  },
	  dist:{
	    src: ['src/js/*.js','!src/js/d3.v3.min.js'],
	    dest: 'dist/<%= pkg.name %>.js'
	  }
	},
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
	    files: {
	      'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
	    }
	  }
    },
    cssmin: {
	  options: {
	    shorthandCompacting: false,
	    roundingPrecision: -1,
	    keepSpecialComments:0
	  },
	  minify : {
            expand : true,
            cwd : 'src/css',
            src : ['*.css', '!*.min.css'],
            dest : 'dist/css',
            ext : '.min.css'
      },
      combine : {
        files: {
            'dist/combined.css': ['dist/css/*.css']
        }
      },
	},
	htmlmin: {                                     
	    dist: {                                     
	      options: {                                 
	        removeComments: true,
	        collapseWhitespace: true
	      },
	      files: {                                   
	        'dist/index.html': 'src/index.html',     
	      }
	    }
	},
	watch: {
/*
	  js: {
	    files: ['src/js/*.js'],
	    tasks: ['jshint']
	  },
*/
	  css: {
        files: 'src/css/*.css',
        tasks: ['css']
      },
      html:{
	      files: 'src/index.html',
	      tasks: ['html']
      }
	},
	jshint: {
      files: ['Gruntfile.js', 'src/js/app/menu/eventListeners.js'],
    }
  });

  // Load plugins.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');



  // Default task(s).
  grunt.registerTask('default', ['cssmin','htmlmin']);
  grunt.registerTask('js', ['concat','uglify']);
  grunt.registerTask('jshint', ['jshint']);
  grunt.registerTask('css', ['cssmin']);
  grunt.registerTask('html', ['htmlmin']);

};