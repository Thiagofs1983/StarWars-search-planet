import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import MyContext from './MyContext';

function MyProvider({ children }) {
  const [data, setData] = useState([]);
  const [filterByName, setFilterByName] = useState('');
  const [dataFilter, setDataFilter] = useState([]);
  const [filterByNumericValues, setFilterByNumericValues] = useState({
    column: 'population',
    comparison: 'maior que',
    value: 0,
  });
  const endpoint = 'https://swapi-trybe.herokuapp.com/api/planets/';
  useEffect(() => {
    const getPlanets = async () => {
      try {
        const response = await fetch(endpoint);
        const { results } = await response.json();
        setData(results);
        setDataFilter(results);
      } catch (error) {
        console.log(error);
      }
    };
    getPlanets();
  }, []);

  useEffect(() => {
    const searchPlanet = data.filter((planet) => planet.name
      .toLowerCase().includes(filterByName));
    setDataFilter(searchPlanet);
  }, [filterByName]);

  const handleChange = ({ target: { value } }) => {
    setFilterByName(value.toLowerCase());
  };

  const handleChangeFilter = ({ target: { value, name } }) => {
    setFilterByNumericValues({
      ...filterByNumericValues,
      [name]: value,
    });
  };

  const handleClickFilter = () => {
    /* Mentoria Lua parou no minuto 66 */
    const { column, value, comparison } = filterByNumericValues;
    if (comparison === 'maior que') {
      const filterClick = dataFilter.filter((planet) => planet[column] > Number(value));
      setDataFilter(filterClick);
    } if (comparison === 'menor que') {
      const filterClick = dataFilter.filter((planet) => planet[column] < Number(value));
      setDataFilter(filterClick);
    } if (comparison === 'igual a') {
      const filterClick = dataFilter.filter((planet) => (
        Number(planet[column]) === Number(value)
      ));
      setDataFilter(filterClick);
    }
  };

  const context = {
    dataFilter,
    filterByName,
    handleChange,
    ...filterByNumericValues,
    handleChangeFilter,
    handleClickFilter,
  };

  return (
    <MyContext.Provider value={ context }>
      { children }
    </MyContext.Provider>
  );
}

MyProvider.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
};

export default MyProvider;
