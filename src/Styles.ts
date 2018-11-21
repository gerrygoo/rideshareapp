import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    taggedTextField: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 10,
        padding: 5,
        borderRadius: 3 ,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    taggedTextFieldTag: {
        flex: 1,
        marginHorizontal: 10,
        color: 'black',
    },
    taggedTextFieldField: {
        flex: 2,
        color: 'black',
    },
    flex1: { flex: 1 },
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10
    },
    picker: {
        flex: 2,
    },
    flatListRow : {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 4,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginRight: 5,
        textAlign: 'left'
    },
    subTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        marginRight: 5,
        textAlign: 'left',
        alignSelf: 'flex-start',
    },
    line: {
        height: 1,
        marginVertical: 5,
        width: '99%',
        marginHorizontal: 5,
        backgroundColor: 'lightgray',
    },
});

