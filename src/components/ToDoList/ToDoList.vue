<template>
  <div class="todolist">
    <h3 class="text-center my-2 text-xl">Todo List</h3>
    <div class="mb-3 flex w-full">
      <Form class="w-full" @submit="addToDo">
        <div class="w-full flex">
          <Field
            class="px-4 py-2 w-full border-solid border-2 border-indigo-600 rounded-l-lg"
            name="todo"
            type="text"
            placeholder="To Do"
            v-model="toDoInput"
            :rules="validateTodo"
          />
          <button
            class="whitespace-nowrap border-solid border-2 text-white bg-indigo-600 border-indigo-600 rounded-r-lg py-2 px-4"
          >
            Add item
          </button>
        </div>
        <ErrorMessage class="text-red-600" name="todo" />
      </Form>
    </div>
    <ul>
      <li
        class="border-solid border-2 border-indigo-400 px-4 py-2 my-4 rounded-lg flex"
        v-for="(todo, index) in toDoList"
        :key="index"
        :class="{
          'bg-green-500': todo.checked,
          'border-green-500': todo.checked,
        }"
      >
        <h2
          class="text-center w-full"
          :class="{
            'line-through': todo.checked,
            'text-green-900': todo.checked,
          }"
        >
          {{ todo.todo }}
        </h2>
        <button type="button" class="z-10 close mr-3" @click="checkTodo(todo)">
          <span class="text-xl">&#10003;</span>
        </button>
        <button type="button" class="z-10 close" @click="delTodo(todo)">
          <span class="text-xl">&times;</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import {
  collection,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Form, Field, ErrorMessage } from "vee-validate";

import firebaseConfig from "@/firebaseConfig";
const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);

class Todo {
  id?: string;
  todo: string;
  checked: boolean;

  constructor(todo: string) {
    this.todo = todo;
    this.checked = false;
  }

  toggleChecked() {
    this.checked = !this.checked;
  }
}

@Options({
  props: {
    msg: String,
  },
  components: {
    Form,
    Field,
    ErrorMessage,
  },
})
export default class ToDoList extends Vue {
  toDoInput = "";
  toDoList: Todo[] = [];

  validateTodo(value: string) {
    // if the field is empty
    if (!value && !value.trim()) {
      return "This field is required";
    }
    // All is good
    return true;
  }

  async addToDo() {
    let todo = new Todo(this.toDoInput);
    this.toDoInput = "";
    try {
      await addDoc(collection(db, "todolist"), {
        todo: todo.todo,
        checked: todo.checked,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    this.getData();
  }

  delTodo(todo: Todo) {
    // console.log("delete: ", todo);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const a: string = todo.id!;
    console.log(a);

    deleteDoc(doc(db, "todolist", a)).then(() => {
      this.$router.go(0);
    });
  }

  async getData() {
    const querySnapshot = await getDocs(collection(db, "todolist"));
    const todolists = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      let todo = new Todo(data.todo);
      todo.id = doc.id;
      todo.checked = data.checked;
      return todo;
    });
    this.toDoList = todolists;
  }

  async checkTodo(todo: Todo) {
    todo.toggleChecked();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const a: string = todo.id!;
    await setDoc(doc(db, "todolist", a), {
      todo: todo.todo,
      checked: todo.checked,
    });
  }

  mounted() {
    this.getData();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../../assets/tailwind.css";
@import "./ToDoList.style.scss";
</style>
