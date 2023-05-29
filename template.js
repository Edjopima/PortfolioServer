const buildTemplate = (data) => {
  return `
  <div>
  <div>
    <p>
      <span class="font-size:16px; margin-right:8px">Nombre:</span>
      <span class="font-size:12px;">${data.name}</span>
    </p>
    <p>
      <span class="font-size:16px; margin-right:8px">Email:</span>
      <span class="font-size:12px;">${data.email}</span>
    </p>
  <p>
    <span class="font-size:16px; margin-right:8px">Mensaje:</span>
    <span class="font-size:12px;">${data.message}</span>
  </p>
  </div>
</div>
  `;
};

module.exports = { buildTemplate };
