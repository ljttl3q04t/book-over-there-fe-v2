import React from "react";
import styled from "styled-components";
import { OrderTable } from "./OrderTable";

const StyledClubOrder = styled.div`
  border-radius: 12px;
  padding: 30px;
  background: #fff;
  width: 100%;
  margin-top: 30px;
  > .table-extra-content {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    h1 {
      font-size: 24px;
    }
    a {
      font-size: 18px;
      margin-top: 2px;
    }
  }
`;

const ClubOrder = () => {
  return (
    <StyledClubOrder>
      <OrderTable/>
    </StyledClubOrder>
  );
};

export default ClubOrder;
 