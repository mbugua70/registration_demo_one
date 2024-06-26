export async function dealerSearch(query) {
  const res = await fetch(`http://localhost:4040/api/dealers/search?query=${query}`, {
    method: "GET",
  });
  const data = await res.json();
  if (!res.ok) {
    console.log(data);
    throw {
      message: data.error,
    };
  }

  return data;
}

// update single dealer

export async function updateDealer(updateData,userId) {

  if (!userId) {
    return;
  }
  console.log(userId);
  try {
    const res = await fetch(`http://localhost:4040/api/dealers/search/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!res.ok) {
      throw new Error("Failed to update the dealer");
    }

    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    return error.message;
  }
}


// getting all question

export async function getQuestions() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    return;
  }
  const res = await fetch("http://localhost:4040/api/questions", {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });

  if (!res.ok) {
    throw {
      message: "Failed to fetch questions",
      // statusText: res.statusText,
      // status: res.status
    };
  }

  console.log(res);
  const data = await res.json();
  return data;
}

// getting colors

export async function getColors() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    return;
  }
  const res = await fetch("http://localhost:4040/api/colors", {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });

  if (!res.ok) {
    throw {
      message: "Failed to fetch colors",
      // statusText: res.statusText,
      // status: res.status
    };
  }

  console.log(res);
  const data = await res.json();
  return data;
}



export const fetchData = async () => {
  const [colors, questions] = await Promise.all([getColors(), getQuestions()]);
  return { colors, questions };
};