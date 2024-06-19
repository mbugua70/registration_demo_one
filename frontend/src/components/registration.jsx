/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { useEffect } from "react";
import Styles from "./form.module.css";
import { dealerSearch, updateDealer } from "./api";

// using loader to pass the message down
import { Form } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Preloader from "./Preloader";

export const loginLoader = ({ request }) => {
  return new URL(request.url).searchParams.get("message");
};

const LoginPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModal, setIsModal] = useState(false);
  const [isSearchBar, setIsSearchBar] = useState(true);
  const [isKeySet, setIsKeySet] = useState(false);

  useEffect(() => {
    const search = async () => {
      if (query.trim() !== "") {
        setLoading(true);
        try {
          const data = await dealerSearch(query);

          setResults(data);
        } catch (err) {
          if (err) {
            const MySwal = withReactContent(Swal);
            MySwal.fire({
              html: <i>{err.message}</i>,
              icon: "error",
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

  const handleUpdateDealer = async (userId, terms) => {
    console.log(userId);
    setIsKeySet((prev) => !prev);

    // updaing the terms & updating the confirmed status

    const updatedValue = {
      terms: terms,
      confirmed: true,
    };
    setLoading(true);
    try {
      const data = await updateDealer(updatedValue, userId);
      setSelectedItem((prev) => ({
        ...prev,
        ...updatedValue,
      }));
      console.log(data);
    } catch (err) {
      if (err) {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
          html: <i>{err.message}</i>,
          icon: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setQuery(e.target.value);
    setIsModal(true);
    setIsSearchBar(true);
  };

  const handleListItemClick = (item) => {
    setSelectedItem(item);
    setIsModal(false);
    setIsSearchBar(false);
    setIsKeySet((prev) => !prev);
  };

  // const handleAccceptRegister = (userId) => {};

  const swalRejectUpdate = (userId) => {
    // updating the terms & updating the confirmed status

    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "Reject And Register?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "yes",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return new Promise((resolve) => {
          handleUpdateDealer(userId, "Rejected");
          resolve();
        });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(result);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        //    new swal("Action");
      }
    });
  };

  const swalAcceptUpdate = (userId) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "Accept And Register?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "yes",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return new Promise((resolve) => {
          handleUpdateDealer(userId, "Accepted");
          resolve();
        });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(result);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        //    new swal("Action");
      }
    });
  };

  return (
    <>
      <div className={Styles.login_container}>
        {/* below instead of using the form we wil use Form from the react router */}
        <Form className={Styles.form} method="get" replace>
          <div className="row input-field">
            {/* search input element */}
            <input
              type="search"
              name="query"
              id="query"
              value={query}
              onChange={handleChange}
              placeholder="Dealer Code/Organization"
            />
          </div>
        </Form>
      </div>

      <div className="results">
        {results.length !== undefined ? undefined : loading ? (
          // preloader component
          <Preloader />
        ) : results.resultDealers.length > 0 ? (
          isSearchBar && (
            <ul className="dealer_container">
              {results.resultDealers.map((item) => (
                <li
                  key={item._id}
                  className="dealer_items"
                  onClick={() => handleListItemClick(item)}
                >
                  {item.confirmed ? (
                    <span className="confirmed_item">
                      confirmed <CheckCircleIcon />{" "}
                    </span>
                  ) : (
                    ""
                  )}
                  <p>Name: {item.name}</p>
                  <p>Company: {item.company}</p>
                  <p>Code: {item.code}</p>
                </li>
              ))}
            </ul>
          )
        ) : (
          <p>No results found</p>
        )}
      </div>

      {!isModal && (
        <div
          key={isKeySet}
          className={
            selectedItem && selectedItem.confirmed
              ? "userdetailsconfirmed"
              : "userdetailsnotconfirmed"
          }
        >
          {selectedItem && (
            <div className="userdetails_two">
              <p>Name: {selectedItem.name}</p>
              <p>Email: {selectedItem.email}</p>
              <p>Company: {selectedItem.company}</p>
              <p>Code: {selectedItem.code}</p>
              {(selectedItem.terms === "Accepted" ||
                selectedItem.terms === "Rejected") && (
                <p>Terms:{selectedItem.terms}</p>
              )}
              <div className="dealers_buttons">
                {!selectedItem.confirmed && (
                  <button
                    className="accept"
                    onClick={() => swalAcceptUpdate(selectedItem._id)}
                  >
                    Accept/Register
                  </button>
                )}
                {!selectedItem.confirmed && (
                  <button
                    className="reject"
                    onClick={() => swalRejectUpdate(selectedItem._id)}
                  >
                    Reject/Register
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default LoginPage;
