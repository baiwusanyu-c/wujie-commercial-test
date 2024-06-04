<template>
  <div class="form-container">
    <div class="form-block">
      <label class="label">
        <span>姓名</span>
        <input data-required class="txt" type="text">
      </label>
    </div>
    <div class="form-block">
      <label class="label">
        <span>地址</span>
        <input class="txt" type="text">
      </label>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.label {
  width: 100px;
  margin-top: 15px;
}
.txt:focus {
  border-color: #1f185c;
}
.form-block {
  transition: 0.5s;
}
.form-block:focus-within {
  background-color: #363636;
}

.label span:has(+ input[data-required])::before {
  content: '*';
  color: #f40;
}
</style>
