import { React } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const TodoPage = ({ deleteTodo, getTodoById }) => {
	const navigate = useNavigate();
	const { id } = useParams();

	const todos = getTodoById(id);

	const handleEdit = () => {
		navigate(`/todos/${id}/edit`);
	};

	const handleDelete = () => {
		deleteTodo(id);
		navigate(`/todos`);
	};

	const handlePage = () => {
		navigate(`/todos`);
	};

	return (
		<>
			<h2>{"Задание № - " + id}</h2>
			<h2>{todos.name}</h2>
			<button type="button" onClick={handleEdit}>
				Изменить задачу
			</button>
			<button type="button" onClick={handleDelete}>
				Удалить задачу
			</button>
			<button type="button" onClick={handlePage}>
				🡰
			</button>
		</>
	);
};

export default TodoPage;
