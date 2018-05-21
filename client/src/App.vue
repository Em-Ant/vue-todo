<template lang="html">
  <div class="main">
    <h3>Vue TODO List</h3>
    <ul>
      <li
        v-for="item in list" :key="item._id"
        is="todo-item" v-bind="item"  @remove="remove"/>
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
import TodoItem from './components/todo-item.vue';
export default {
  components: {
    'todo-item': TodoItem
  },
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

<style lang="scss">
@import './utils.scss';
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
  form {
    max-width: 400px;
    padding: 10px;
    height: 50px;
    @extend .material-box;
    button {
      float: right;
      width: 30px;
      height: 30px;
      background-color: $lightblue;
      @extend .round-btn;
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
      border: 1px solid $grey;
      max-width: 350px;
      transition: background-color 0.1s ease-in-out;
      &[disabled] {
        background-color: $lightgrey;
        color: white;
        &::placeholder {
          opacity: 1;
          color: white;
        }
      }
    }
  }
}
</style>
