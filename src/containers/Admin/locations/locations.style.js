import styled from 'styled-components';

const LocationsStyleWrapper = styled.div`
  .locations-header {
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    > h2 {
      font-family: 'Roboto';
      font-weight: 400;
      line-height: 32px;
      vertical-align: middle;
      margin-right: 10px;
    }

    .locations-add-button {
      border-radius: 4px;
    }
  }

  .locations-map {
    width: 500px;
    height: 500px;
  }
`;

export default LocationsStyleWrapper;
