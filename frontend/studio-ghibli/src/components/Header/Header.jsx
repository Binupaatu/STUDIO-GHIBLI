import Card from "./Card/Card";
import {
  ImageBoxContainer,
  ImageContainer,
} from "./Header.styles";
  
  const Header = () => {
    return (
      // <HeaderContainer>
      <ImageBoxContainer>
        <ImageContainer src="images/header/header.jpg" alt height={450} />
        <Card />
      </ImageBoxContainer>
      // </HeaderContainer>
    );
  };
  
  export default Header;
  