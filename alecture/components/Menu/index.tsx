import React, { CSSProperties, FC, useCallback } from "react"
import { CloseModalButton, CreateMenu } from "@components/Menu/styles"

interface Props {   // ts
  style: CSSProperties;
  onCloseModal: (e: any) => void;
}

const Menu: FC<Props> = ({ children, style, onCloseModal }) => {

  const stopPropagation = useCallback((e) => {    // 부모 컴포넌트로 이벤트버블링 막음
    e.stopPropagation();
  }, [])

  return (
    <CreateMenu onClick={onCloseModal}>
      <div style={style} onClick={stopPropagation}>
        <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
        {children}
      </div>
    </CreateMenu>
  )
}

// Menu.propTypes = { }   // js


export default Menu;