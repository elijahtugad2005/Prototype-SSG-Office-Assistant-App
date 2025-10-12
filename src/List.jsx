

function List (){

    const fruits = [{id: 1, name:"hufflepuff", specialty: "Emphaty"},
        {id: 2, name:"gryfindor" , specialty:"Courage"},
        {id: 3, name:"ravenclaw",specialty: "Intelligence"},
        {id: 4, name: "slytherin", specialty: "Ambition"}];

    const listItem = fruits.map(fruits => <li key ={fruits.id}>{fruits.name}:
                                                                  &nbsp;<b>{fruits.specialty}</b>              
    </li>)

    return(<ol>{listItem}</ol>);
}

export default List