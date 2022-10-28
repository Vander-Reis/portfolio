<script setup>
import { RouterLink } from 'vue-router'

</script>

<template>
  <header>
    <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">Sobre</RouterLink>
        <RouterLink to="/work">Trabalho</RouterLink>
        <RouterLink to="/contact">Contato</RouterLink>
      </nav>
  </header>
  
</template>

<style>
  header nav {
    display: flex;
    align-items: center;
    justify-content: end;
    gap: 3.375rem;
  }

  header nav a {
    color: white;
    text-decoration: none;
  }

  header nav a:hover {
    color:#FFB800;
  }

  @media(max-width: 680px) {
    header nav {
      justify-content: center;
    }
  }
</style>
