<template lang="html">
  <div class="main">
    <h3>Vue TODO List</h3>
    <ul>
      <li v-for="item in list" :key="item._id">
        <span>{{item.name}}</span>
        <span
        class="remove"
          :class="{'disabled': item._id === '__tmp'}"
          role="button"
          tabindex=1
          @click="remove(item._id)"
          @keyup.enter="remove(item._id)"
        />
      </li>
    </ul>
    <form @submit.prevent="add({name})" >
      <input v-focus v-model.trim="name" type="text" placeholder="next todo..."
        name="name" :disabled="loading > 0"/>
      <button type="submit" :disabled="loading > 0 || !name" name="update"/>
    </form>
    <p v-if="loading">loading...</p>
  </div>
</template>

<script>
let d = true;
export default {
  data() {
    return {
      list: [],
      name: '',
      loading: 0
    };
  },
  created() {
    this.fetch();
  },
  directives: {
    focus: {
      update(el) {
        if (d && !el.disabled) el.focus();
        d = el.disabled;
      }
    }
  },
  methods: {
    async fetch() {
      this.loading++;
      const res = await fetch('/api/todo');
      this.loading--;
      if (res.ok) {
        const list = await res.json();
        this.list = list;
      }
    },
    async add(item) {
      if (!item || !item.name) return;
      const oldList = [...this.list];
      this.list.push({ ...item, _id: '__tmp' });
      this.loading++;
      const headers = new Headers({
        'Content-Type': 'application/json'
      });
      const res = await fetch('/api/todo', {
        method: 'post',
        headers,
        body: JSON.stringify(item)
      });
      this.loading--;
      if (res.ok) {
        const item = await res.json();
        this.list.splice(-1, 1, item);
        this.name = '';
      } else {
        this.list = oldList;
      }
    },
    async remove(id) {
      const oldList = [...this.list];
      this.list = this.list.filter(i => i._id !== id);
      this.loading++;
      const res = await fetch(`/api/todo/${id}`, {
        method: 'delete'
      });
      this.loading--;
      if (res.ok) {
        const item = await res.json();
        if (item !== 1) this.list = oldList;
      } else {
        this.list = oldList;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@mixin round-btn {
  border: none;
  border-radius: 50%;
  color: white;
  transition: background-color 0.2s ease-in-out;
  font-family: monospace;
  font-weight: bolder;
  text-align: center;
  cursor: pointer;
  &.disabled,
  &[disabled] {
    pointer-events: none;
    cursor: default;
    background-color: #ccc;
  }
}
.main {
  color: #444;
  font-family: sans-serif;
  max-width: 400px;
  margin: 20px auto;
  h3 {
    text-align: center;
  }
  ul {
    list-style: none;
    padding-left: 0;
  }
  li {
    padding: 10px;
    line-height: 20px;
    border-radius: 3px;
    border: none;
    margin-bottom: 5px;
    background-color: white;
    box-shadow: 0 2px 2px 0px rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);
    .remove {
      &::before {
        content: '-';
      }
      &:hover {
        background-color: #f13535;
      }
      float: right;
      display: inline-block;
      box-sizing: border-box;
      width: 20px;
      height: 20px;
      background-color: #fb6464;
      @include round-btn;
    }
  }
  form {
    max-width: 400px;
    padding: 10px;
    height: 50px;
    background-color: white;
    box-shadow: 0 2px 2px 0px rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);
    border-radius: 3px;
    button {
      float: right;
      width: 30px;
      height: 30px;
      background-color: #5151ff;
      @include round-btn;
      margin: 0;
      margin-left: 5px;
      &::before {
        content: '+';
      }
      &:hover {
        background-color: blue;
      }
    }
    input {
      width: 80%;
      margin: 0;
      height: 30px;
      padding: 5px;
      border-radius: 3px;
      border: 1px solid #e0e0e0;
      max-width: 350px;
      transition: background-color 0.1s ease-in-out;
      &[disabled] {
        background-color: #ccc;
        color: white;
        &::placeholder {
          opacity: 1;
          color: #f0f0f0;
        }
      }
    }
  }
}
</style>
