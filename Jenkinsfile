pipeline {
    agent any
    tools {
            node {
        env.NODEJS_HOME = "${tool 'Node 14.x'}"
        env.PATH="${env.NODEJS_HOME}/bin:${env.PATH}"
        sh 'npm --version'
    }
    }
    stages {
       
        stage('Build') {
            steps {
                sh 'npm install' 
            }
        }
         stage('Unit Tests') {
            steps {
                sh 'npm run test'
            }
        }
        stage('End-to-End Tests') {
            steps { 
                sh 'npm run test:e2e'
            }
        }
        stage('Deploy') {
            steps {
                 echo 'Despliegue completado.'
            }
        }
    }
}