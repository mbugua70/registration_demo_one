/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { useEffect } from "react";
import Styles from "./form.module.css";
import { dealerSearch } from "./api";

// using loader to pass the message down
import { Form } from "react-router-dom";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useState } from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


export const loginLoader = ({ request }) => {
  return new URL(request.url).searchParams.get("message");
};


const LoginPage = () => {
  // code for logging status with useNavigation hook


  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModal, setIsModal] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [terms, setTerms] =  useState("");

  useEffect(() => {
    const search = async () => {
      if (query.trim() !== '') {
        setLoading(true);
        try {
          const data = await dealerSearch(query);
          setResults(data);
        } catch (err) {
          if (err) {
            const MySwal = withReactContent(Swal);
            MySwal.fire({
              html: <i>{err.message}</i>,
              icon: 'error',
            });
          }
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      search();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleChange = (e) => {
    setQuery(e.target.value);
    setIsModal(true);
  };

  const handleListItemClick = (item) => {
    setSelectedItem(item);
    setIsModal(false)
  };

  const handleAccceptRegister = () => {

  }

  const handleRejectRegister = () => {

  }



console.log(isModal);
console.log(results)
  return (
    <>
      <div className={Styles.login_container}>
        {/* below instead of using the form we wil use Form from the react router */}
        <Form className={Styles.form} method="get"  replace>
          <div className="row">
            <div className="errorlgnmsg">
              {/* {loginMssgError && (
                <div className="alert alert-danger" role="alert">
                  <p>
                    <i className="material-icons">error</i>
                  </p>
                  <p className="error_alert_message">{loginMssgError}</p>
                </div>
              )} */}
            </div>
          </div>
          <div className="row input-field">
            {/* search input element */}
            <input type="search" name="query" id="query" value={query} onChange={handleChange} placeholder="Dealer Code/Organization" />
          </div>
             <div className="results">

              {results.length !== undefined  ? <p>No results found</p> : (loading ? (
            <p>Loading...</p>
          ) : results.resultDealers.length > 0 ? (
            <ul className="dealer_container">
              {results.resultDealers.map((item) => (
                <li key={item._id} className="dealer_items" onClick={() => handleListItemClick(item)} >
                  {item.confirmed ?  <span className="confirmed_item">confirmed <CheckCircleIcon/> </span> : ""}
                  <p>Name: {item.name}</p>
                  <p>Company: {item.company}</p>
                  <p>Code: {item.code}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No results found</p>
          ))}
             </div>
        </Form>
      </div>

       {!isModal &&  (<div className="userdetails">
         {selectedItem && (
        <div className="userdetails_two">
          <p>Name: {selectedItem.name}</p>
          <p>Email: {selectedItem.email}</p>
          <p>Company: {selectedItem.company}</p>
          <p>Code: {selectedItem.code}</p>
          <div className="dealers_buttons">
          <button className="accept" onClick={handleAccceptRegister}>Accept/Register</button>
            <button className="reject" onClick={handleRejectRegister}>Reject/Register</button>
          </div>
        </div>
      )}
         </div>)}

    </>
  );
};

export default LoginPage;
