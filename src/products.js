// import { BASE_URL } from "./contants";

// // GET
// export const getProduct = async () => {
//   const res = await fetch(BASE_URL);
//   return await res.json();
// };

// // POST
// export const postProduct = async (product) => {
//   const res = await fetch(BASE_URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(product),
//   });

//   return await res.json();
// };

// // PUT
// export const updateProduct = async (id, product) => {
//   const res = await fetch(`${BASE_URL}/${id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(product),
//   });

//   return await res.json();
// };

// // DELETE
// export const deleteProduct = async (id) => {
//   await fetch(`${BASE_URL}/${id}`, {
//     method: "DELETE",
//   });
// };