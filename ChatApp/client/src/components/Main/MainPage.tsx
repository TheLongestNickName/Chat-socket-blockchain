import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./MainPage.scss";

type field = {
  name: string;
  room: string;
};

export const MainPage = () => {
  const [values, setValues] = useState<field>({ name: "", room: "" });

  const handleChange = ({
    target: { value, name },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [name]: value });
  };
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const isDisable = Object.values(values).some((value) => !value);
    if (isDisable) e.preventDefault();
  };
  return (
    <div className="main-page">
      <div className="container">
        <h1 className="main-page--heading">Join to chat</h1>
        <form action="" className="main-page__form">
          <div className="main-page__form--group">
            <input
              type="text"
              name="name"
              value={values.name}
              autoComplete="off"
              placeholder="User name"
              onChange={handleChange}
              className="main-page__form--input"
              required
            />
            <input
              type="text"
              name="room"
              value={values.room}
              autoComplete="off"
              placeholder="Enter name of room"
              onChange={handleChange}
              className="main-page__form--input"
              required
            />
          </div>
          <Link
            to={`./chat?name=${values.name}&room=${values.room}`}
            onClick={handleClick}
            className="main-page__form--group"
          >
            <button type="submit" className="main-page__form--button">
              Sing in
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};
