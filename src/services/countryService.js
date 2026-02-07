export async function fetchCountries() {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=cca2,name,translations",
    );

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("API did not return an array");
    }

    const countries = data
      .map((country) => ({
        code: country.cca2,
        name:
          country.translations?.spa?.common ||
          country.name?.common ||
          "Desconocido",
      }))
      .filter((c) => c.code && c.name)
      .sort((a, b) => a.name.localeCompare(b.name, "es"));

    return countries;
  } catch (error) {
    console.error("Error fetching countries:", error);

    return [
      { code: "AR", name: "Argentina" },
      { code: "CO", name: "Colombia" },
      { code: "ES", name: "España" },
      { code: "MX", name: "México" },
      { code: "US", name: "Estados Unidos" },
    ];
  }
}
