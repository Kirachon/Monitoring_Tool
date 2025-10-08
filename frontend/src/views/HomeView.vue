<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card elevation="4">
          <v-card-title class="text-h4 text-center py-6 bg-primary">
            <span class="text-white">Philippine Government HRMS</span>
          </v-card-title>
          
          <v-card-text class="pa-8">
            <v-row>
              <v-col cols="12" class="text-center">
                <v-icon size="80" color="primary">mdi-account-group</v-icon>
                <h2 class="mt-4 mb-2">Human Resource Management System</h2>
                <p class="text-body-1 text-grey-darken-1">
                  Welcome to the Philippine Government HRMS
                </p>
              </v-col>
            </v-row>

            <v-divider class="my-6"></v-divider>

            <v-row>
              <v-col cols="12" md="4" class="text-center">
                <v-icon size="48" color="primary">mdi-file-document-outline</v-icon>
                <h3 class="mt-2">Pass Slips</h3>
                <p class="text-caption">Manage employee pass slips</p>
              </v-col>
              <v-col cols="12" md="4" class="text-center">
                <v-icon size="48" color="primary">mdi-calendar-check</v-icon>
                <h3 class="mt-2">Leave Management</h3>
                <p class="text-caption">Track and approve leaves</p>
              </v-col>
              <v-col cols="12" md="4" class="text-center">
                <v-icon size="48" color="primary">mdi-certificate</v-icon>
                <h3 class="mt-2">Certificates</h3>
                <p class="text-caption">Generate HR certificates</p>
              </v-col>
            </v-row>

            <v-row class="mt-4">
              <v-col cols="12" class="text-center">
                <v-chip color="success" class="mr-2">
                  <v-icon start>mdi-check-circle</v-icon>
                  System Online
                </v-chip>
                <v-chip color="info">
                  <v-icon start>mdi-information</v-icon>
                  Version 1.0.0
                </v-chip>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions class="justify-center pb-6">
            <v-btn color="primary" size="large" prepend-icon="mdi-login">
              Login to Continue
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// Home view component
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>

