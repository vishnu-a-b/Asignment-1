"use client";
import { useEffect, useState } from "react";
import { Table, Pagination, Form } from "react-bootstrap";

export default function Countries() {
  const [countries, setCountries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortField, setSortField] = useState("name");

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        "https://raw.githubusercontent.com/hiiamrohit/Countries-States-Cities-database/master/countries.json"
      );
      const data = await res.json();
      setCountries(data.countries);
    }

    fetchData();
  }, []);

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Function to handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  // Function to handle sorting
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and sort the countries based on search and sort criteria
  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort the filtered countries based on sort criteria
  const sortedCountries = filteredCountries.slice().sort((a, b) => {
    const aValue = a[sortField].toString().toLowerCase();
    const bValue = b[sortField].toString().toLowerCase();
    const multiplier = sortDirection === "asc" ? 1 : -1;
    return multiplier * aValue.localeCompare(bValue);
  });

  // Pagination calculations
  const indexOfLastCountry = currentPage * itemsPerPage;
  const indexOfFirstCountry = indexOfLastCountry - itemsPerPage;
  const currentCountries = sortedCountries.slice(
    indexOfFirstCountry,
    indexOfLastCountry
  );

  return (
    <div className="p-10">
      <h1>List of Countries</h1>

      <Form.Group controlId="search">
        <Form.Control
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Form.Group>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}>
              Name{" "}
              {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th onClick={() => handleSort("phoneCode")}>
              Phone Code{" "}
              {sortField === "phoneCode" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th onClick={() => handleSort("sortname")}>
              Sort Name{" "}
              {sortField === "sortname" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </th>
          </tr>
        </thead>
        <tbody>
          {currentCountries.map((country) => (
            <tr key={country.name}>
              <td>{country.name}</td>
              <td>{country.phoneCode}</td>
              <td>{country.sortname}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {Array.from(
          { length: Math.ceil(sortedCountries.length / itemsPerPage) },
          (_, i) => (
            <Pagination.Item
              key={i}
              active={i + 1 === currentPage}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          )
        )}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={
            currentPage === Math.ceil(sortedCountries.length / itemsPerPage)
          }
        />
      </Pagination>
    </div>
  );
}
