<template>
  <div>
    <v-row>
      <v-col cols="12" md="3">
        <ActionCard icon="mdi-walk" title="Pass Slips" description="Request a pass slip" to="/pass-slips" />
      </v-col>
      <v-col cols="12" md="3">
        <ActionCard icon="mdi-calendar" title="Leave" description="Apply for leave" to="/leave" />
      </v-col>
      <v-col cols="12" md="3">
        <ActionCard icon="mdi-certificate" title="Certificates" description="Request certificates" to="/certificates" />
      </v-col>
      <v-col cols="12" md="3">
        <ActionCard icon="mdi-account" title="My Profile" description="View your profile" to="/profile" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import ActionCard from '@/components/ActionCard.vue'
</script>

