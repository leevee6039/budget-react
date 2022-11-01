import { useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import './App.css';
import DisplayBalance from './components/DisplayBalance';
import DisplayBalances from './components/DisplayBalances';
import EntryLines from './components/EntryLines';
import MainHeader from './components/MainHeader';
import ModelEdit from './components/ModelEdit';
import NewEntryForm from './components/NewEntryForm';
import { legacy_createStore as createStore, combineReducers } from 'redux';
// import { configureStore } from '@reduxjs/toolkit';

function App() {
  const [entries, setEntries] = useState(initialEntries);
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [isExpense, setIsExpense] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [entryId, setEntryId] = useState();
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!isOpen && entryId) {
      const index = entries.findIndex((entry) => entry.id === entryId);
      const newEntries = [...entries];
      newEntries[index].description = description;
      newEntries[index].value = value;
      newEntries[index].isExpense = isExpense;
      setEntries(newEntries);
      resetEntry();
    }
    // eslint-disable-next-line
  }, [isOpen]);

  useEffect(() => {
    let totalIncomes = 0;
    let totalExpenses = 0;
    entries.map((entry) => {
      if (entry.isExpense) {
        return (totalExpenses += Number(entry.value));
      }
      return (totalIncomes += Number(entry.value));
    });
    setTotal(totalIncomes - totalExpenses);
    setExpenseTotal(totalExpenses);
    setIncomeTotal(totalIncomes);
    // eslint-disable-next-line
  }, [entries]);

  function entriesReducer(state = initialEntries, action) {
    // console.log('action: ', action);
    let newEntries;
    switch (action.type) {
      case 'ADD_ENTRY':
        newEntries = state.concat({ ...action.payload });
        return newEntries;
      case 'REMOVE_ENTRY':
        newEntries = state.filter((entry) => entry.id !== action.payload.id);
        return newEntries;

      default:
        return state;
    }
  }

  const combinedReducers = combineReducers({
    entries: entriesReducer,
  });

  const store = createStore(combinedReducers);

  // console.log('store before: ', store.getState());
  store.subscribe(() => {
    console.log('store : ', store.getState());
  });

  const payload_add = {
    id: 5,
    description: 'Hello from Redux!',
    value: 999,
    isExpense: true,
  };

  const payload_remove = {
    id: 1,
  };

  function addEntryRedux(payload) {
    return { type: 'ADD_ENTRY', payload };
  }

  function removeEntryRedux(id) {
    return { type: 'REMOVE_ENTRY', payload: id };
  }

  store.dispatch(addEntryRedux(payload_add));
  store.dispatch(removeEntryRedux(payload_remove));
  // console.log('store after: ', store.getState());

  function deleteEntry(id) {
    const result = entries.filter((entry) => entry.id !== id);
    setEntries(result);
  }

  function editEntry(id) {
    console.log('edit entry with', id);
    if (id) {
      const index = entries.findIndex((entry) => entry.id === id);
      const entry = entries[index];
      setEntryId(id);
      setDescription(entry.description);
      setValue(entry.value);
      setIsExpense(entry.isExpense);
      setIsOpen(true);
    }
  }

  function addEntry() {
    const result = entries.concat({
      id: entries.length + 1,
      description,
      value,
      isExpense,
    });
    console.log('result', result);
    console.log('entries', entries);
    setEntries(result);
    resetEntry();
  }

  function resetEntry() {
    setDescription('');
    setValue('');
    setIsExpense(true);
  }

  return (
    <Container>
      <MainHeader title="Budget" />
      <DisplayBalance title="Your Balance:" value={total} size="small" />

      <DisplayBalances incomeTotal={incomeTotal} expenseTotal={expenseTotal} />

      <MainHeader title="History" type="h3" />

      <EntryLines
        entries={entries}
        deleteEntry={deleteEntry}
        editEntry={editEntry}
      />

      <MainHeader title="Add new transaction" type="h3" />
      <NewEntryForm
        addEntry={addEntry}
        description={description}
        value={value}
        isExpense={isExpense}
        setDescription={setDescription}
        setValue={setValue}
        setIsExpense={setIsExpense}
      />
      <ModelEdit
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        addEntry={addEntry}
        description={description}
        value={value}
        isExpense={isExpense}
        setDescription={setDescription}
        setValue={setValue}
        setIsExpense={setIsExpense}
      />
    </Container>
  );
}

export default App;

var initialEntries = [
  {
    id: 1,
    description: 'Work Income',
    value: 1000.0,
    isExpense: false,
  },
  {
    id: 2,
    description: 'Water bill',
    value: 20.0,
    isExpense: true,
  },
  {
    id: 3,
    description: 'Rent',
    value: 300.0,
    isExpense: true,
  },
  {
    id: 4,
    description: 'Power bill',
    value: 50.0,
    isExpense: true,
  },
];
