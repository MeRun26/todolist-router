import { React, useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import EditTodo from "../components/EditTodo/EditTodo";
import TodoPage from "../components/TodoPage/TodoPage";
import TodoList from "../components/TodoList/TodoList";
import useDebounce from "../hook/useDebounce";

const TodoLayout = () => {
	const { id, edit } = useParams();
	const [todos, setTodos] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [search, setSearch] = useState("");

	const debounceValue = useDebounce(search, 2000);

	const loadTodo = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(
				`http://localhost:1326/todos?q=${debounceValue}`
			);
			const data = await response.json();
			setTodos(data);
			setIsLoading(false);
		} catch (error) {}
	};

	let sortedTodos = [];

	const sortTodosAlphabet = () => {
		sortedTodos = todos.slice().sort((a, b) => (a.name > b.name ? 1 : -1));
		setTodos(sortedTodos);
	};

	const addTodo = async (newTodo) => {
		try {
			const response = await fetch("http://localhost:1326/todos", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newTodo),
			});
			const data = await response.json();

			setTodos((prevTodos) => [...prevTodos, data]);
		} catch (error) {}
		loadTodo();
	};

	const editTodo = async (id, payload) => {
		try {
			const response = await fetch(`http://localhost:1326/todos/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});
			const updateData = await response.json();

			const updateArray = todos.map((todo) => {
				if (todo.id === id) {
					todo = updateData;
				}
				return todo;
			});

			setTodos(updateArray);
		} catch (error) {}
		loadTodo();
	};

	const deleteTodo = (id) => {
		fetch(`http://localhost:1326/todos/${id}`, {
			method: "DELETE",
			"Content-Type": "application/json",
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				setTodos(
					todos.filter((todo, index, array) => {
						return todo.id !== id;
					})
				);
			});
		loadTodo();
	};

	const getTodoById = (id) => {
		return todos.find((todo) => todo.id === Number(id));
	};

	useEffect(() => {
		loadTodo();
		// eslint-disable-next-line
	}, [debounceValue]);

	const isValidId = (id) => {
		return (
			// eslint-disable-next-line
			!isNaN(id) && parseInt(id) == id && !isNaN(parseInt(id, 10))
		);
	};

	if (id && !isValidId(id)) {
		return <Navigate to="/404" />;
	}

	if (id && edit && edit !== "edit") {
		return <Navigate to="/404" />;
	}

	return (
		<div>
			{isLoading ? (
				<h1>ЗАГРУЗКА...</h1>
			) : (
				<div>
					{id ? (
						edit === "edit" ? (
							<EditTodo
								editTodo={editTodo}
								getTodoById={getTodoById}
							/>
						) : (
							<TodoPage
								deleteTodo={deleteTodo}
								getTodoById={getTodoById}
							/>
						)
					) : (
						<TodoList
							todos={todos}
							addTodo={addTodo}
							sortTodosAlphabet={sortTodosAlphabet}
							search={search}
							setSearch={setSearch}
						/>
					)}
				</div>
			)}
		</div>
	);
};

export default TodoLayout;
