function Container({children}) {
    return <div className='w-full max-w-7xl mx-auto px-4 py-2.5'>{children}</div>;
//     On a large screen (e.g., 1440px wide)
// → The div will be 1280px wide (because max-w-7xl caps it at 1280px).
}
  
export default Container