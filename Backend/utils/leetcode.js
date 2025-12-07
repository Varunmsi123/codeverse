const fetch = global.fetch;

async function fetchLeetCodeSummary(username) {
  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        profile {
          Summary
        }
      }
    }
  `;

  try {
    const res = await fetch("https://leetcode.com/graphql/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { username }
      })
    });

    const data = await res.json();

    // If user does not exist OR profile hidden
    if (!data?.data?.matchedUser) {
      return null;
    }

    const summary = data.data.matchedUser.profile?.aboutMe;

    return summary ? summary.trim() : null;

  } catch (err) {
    console.log("GraphQL summary fetch error:", err);
    return null;
  }
}

module.exports = { fetchLeetCodeSummary };
