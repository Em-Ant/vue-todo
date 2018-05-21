<template lang="html">
  <li>
    <span>{{name}}</span>
    <span
    class="remove"
      :class="{'disabled': _id === '__tmp'}"
      role="button"
      tabindex=1
      @click="$emit('remove', _id)"
      @keyup.enter="$emit('remove', _id)"
    />
  </li>
</template>

<script>
export default {
  props: {
    _id: String,
    name: String
  }
};
</script>

<style lang="scss">
@import '../utils';
li {
  padding: 10px;
  line-height: 20px;
  border: none;
  margin-bottom: 5px;
  @extend .material-box;
  .remove {
    &::before {
      content: '-';
    }
    &:hover {
      background-color: $red;
    }
    float: right;
    display: inline-block;
    box-sizing: border-box;
    width: 20px;
    height: 20px;
    background-color: $lightred;
    @extend .round-btn;
  }
}
</style>
